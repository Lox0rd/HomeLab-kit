import { useEffect, useState } from 'react'
import { Navigation } from '../components/Navigation'
import { axiosInstance } from '../api/client'
import { i18n } from '../i18n'

interface Lab {
  id: string
  title: string
  difficulty: string
  estimated_time: number
  prerequisites: string[]
}

interface LabDetails {
  id: string
  title: string
  difficulty: string
  estimated_time: number
  description: string
  task: string
  hints: string[]
  validation: Record<string, any>
}

interface LabProgress {
  completed: string[]
  unlocked: string[]
}

export function Labs() {
  const [labs, setLabs] = useState<Lab[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedLab, setSelectedLab] = useState<Lab | null>(null)
  const [labDetails, setLabDetails] = useState<LabDetails | null>(null)
  const [result, setResult] = useState<{ passed: boolean; feedback: string } | null>(null)
  const [currentHintIndex, setCurrentHintIndex] = useState(0)
  const [checking, setChecking] = useState(false)
  const [progress, setProgress] = useState<LabProgress>({ completed: [], unlocked: [] })

  useEffect(() => {
    const fetchLabs = async () => {
      try {
        const lang = i18n.getLanguage()
        const response = await axiosInstance.get('/labs/', {
          headers: {
            'Accept-Language': lang
          }
        })
        const fetchedLabs = response.data.labs || []
        setLabs(fetchedLabs)

        const saved = localStorage.getItem('labProgress')
        if (!saved && fetchedLabs.length > 0) {
          setProgress({ completed: [], unlocked: [fetchedLabs[0].id] })
        } else if (saved) {
          setProgress(JSON.parse(saved))
        }
      } catch (err) {
        console.error('Failed to fetch labs')
      } finally {
        setLoading(false)
      }
    }

    fetchLabs()
  }, [])

  const saveProgress = (newProgress: LabProgress) => {
    setProgress(newProgress)
    localStorage.setItem('labProgress', JSON.stringify(newProgress))
  }

  const isLabUnlocked = (labId: string) => progress.unlocked.includes(labId) || progress.completed.includes(labId)
  const isLabCompleted = (labId: string) => progress.completed.includes(labId)

  const handleSelectLab = async (lab: Lab) => {
    if (!isLabUnlocked(lab.id)) return

    setSelectedLab(lab)
    setResult(null)
    setCurrentHintIndex(0)
    try {
      const lang = i18n.getLanguage()
      const response = await axiosInstance.get(`/labs/${lab.id}`, {
        headers: {
          'Accept-Language': lang
        }
      })
      setLabDetails(response.data)
    } catch (err) {
      console.error('Failed to fetch lab details')
    }
  }

  const handleCheckLab = async () => {
    if (!selectedLab) return

    setChecking(true)
    try {
      const response = await axiosInstance.post(`/labs/${selectedLab.id}/submit`, {
        solution: ''
      })

      if (response.data.passed) {
        const newProgress = {
          ...progress,
          completed: [...new Set([...progress.completed, selectedLab.id])],
          unlocked: [...new Set([...progress.unlocked, selectedLab.id])]
        }

        const currentIndex = labs.findIndex(l => l.id === selectedLab.id)
        if (currentIndex < labs.length - 1) {
          newProgress.unlocked.push(labs[currentIndex + 1].id)
        }

        saveProgress(newProgress)
      }

      setResult({
        passed: response.data.passed,
        feedback: response.data.feedback
      })
    } catch (err) {
      setResult({
        passed: false,
        feedback: 'Error checking lab'
      })
    } finally {
      setChecking(false)
    }
  }

  const handleUnlockAll = () => {
    const allLabIds = labs.map(l => l.id)
    saveProgress({
      completed: progress.completed,
      unlocked: allLabIds
    })
  }

  const handleResetProgress = () => {
    localStorage.removeItem('labProgress')
    setProgress({ completed: [], unlocked: labs.length > 0 ? [labs[0].id] : [] })
    setSelectedLab(null)
    setLabDetails(null)
    setResult(null)
    setCurrentHintIndex(0)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-status-success/10 text-status-success'
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800'
      case 'advanced':
        return 'bg-orange-100 text-orange-800'
      case 'expert':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text'
    }
  }

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="p-8">{i18n.t('common.loading')}</div>
      </>
    )
  }

  return (
    <>
      <Navigation />
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">{i18n.t('labs.title')}</h1>
          <div className="flex gap-2">
            <button
              onClick={handleUnlockAll}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 font-semibold text-sm"
            >
              🔓 {i18n.t('labs.unlockAll')}
            </button>
            <button
              onClick={handleResetProgress}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-semibold text-sm"
            >
              🔄 {i18n.t('labs.resetProgress')}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">{i18n.t('labs.availableLabs')} ({labs.length})</h2>
              <span className="text-sm text-light-muted dark:text-dark-muted">{progress.completed.length}/{labs.length} {i18n.t('labs.completed')}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              {labs.map((lab) => {
                const unlocked = isLabUnlocked(lab.id)
                const completed = isLabCompleted(lab.id)
                return (
                  <div
                    key={lab.id}
                    onClick={() => unlocked && handleSelectLab(lab)}
                    className={`bg-light-surface dark:bg-dark-surface rounded-lg shadow p-4 transition ${
                      unlocked ? 'hover:shadow-lg cursor-pointer' : 'opacity-50 cursor-not-allowed'
                    } ${selectedLab?.id === lab.id ? 'ring-2 ring-blue-600' : ''}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="text-sm text-light-muted dark:text-dark-muted font-mono">{lab.id}</div>
                      {completed && <span className="text-xl">✓</span>}
                      {!unlocked && <span className="text-xl">🔒</span>}
                    </div>
                    <h3 className="text-lg font-bold mb-2">{lab.title}</h3>
                    <div className="flex justify-between items-center">
                      <span className={`px-2 py-1 rounded text-xs font-semibold capitalize ${getDifficultyColor(lab.difficulty)}`}>
                        {i18n.t(`labs.${lab.difficulty}` as any, lab.difficulty)}
                      </span>
                      <span className="text-sm text-light-muted dark:text-dark-muted">{lab.estimated_time} {i18n.t('labs.minutes')}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div>
            {selectedLab && labDetails ? (
              <div className="bg-light-surface dark:bg-dark-surface rounded-lg shadow p-6 space-y-4">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{selectedLab.title}</h2>
                  <p className="text-light-muted dark:text-dark-muted text-sm">{labDetails.description}</p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded p-3">
                  <h3 className="font-semibold text-blue-900 mb-2">📋 {i18n.t('labs.task')}:</h3>
                  <p className="text-sm text-blue-900">{labDetails.task}</p>
                </div>

                {result && (
                  <div className={`p-3 rounded border-l-4 ${
                    result.passed
                      ? 'bg-green-50 border-green-500 text-status-success'
                      : 'bg-red-50 border-red-500 text-red-800'
                  }`}>
                    <div className="font-semibold text-sm">{result.passed ? '✓ ' + i18n.t('labs.passed') : '✗ ' + i18n.t('labs.failed')}</div>
                    <p className="text-xs mt-1">{result.feedback}</p>
                  </div>
                )}

                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={handleCheckLab}
                    disabled={checking}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-semibold text-sm disabled:opacity-50"
                  >
                    {checking ? i18n.t('common.loading') : '✓ ' + i18n.t('labs.submit')}
                  </button>

                  {labDetails.hints && labDetails.hints.length > 0 && currentHintIndex < labDetails.hints.length && (
                    <button
                      onClick={() => setCurrentHintIndex(currentHintIndex + 1)}
                      className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 font-semibold text-sm"
                    >
                      💡 {i18n.t('labs.getHint')} ({currentHintIndex + 1}/{labDetails.hints.length})
                    </button>
                  )}

                  <button
                    onClick={() => {
                      const response = axiosInstance.get(`/labs/${selectedLab.id}/solution`)
                      response.then(res => {
                        alert('📖 ' + i18n.t('labs.solution') + ':\n\n' + res.data.solution)
                      })
                    }}
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 font-semibold text-sm"
                  >
                    📖 {i18n.t('labs.showSolution')}
                  </button>
                </div>

                {currentHintIndex > 0 && currentHintIndex <= labDetails.hints.length && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                    <h4 className="font-semibold text-yellow-900 text-sm mb-1">💡 {i18n.t('labs.hint')} {currentHintIndex}:</h4>
                    <p className="text-sm text-yellow-800">{labDetails.hints[currentHintIndex - 1]}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-light-surface dark:bg-dark-surface p-2 rounded">
                    <div className="text-light-muted dark:text-dark-muted">{i18n.t('labs.difficulty')}</div>
                    <div className="font-semibold capitalize">{i18n.t(`labs.${selectedLab.difficulty}` as any, selectedLab.difficulty)}</div>
                  </div>
                  <div className="bg-light-surface dark:bg-dark-surface p-2 rounded">
                    <div className="text-light-muted dark:text-dark-muted">{i18n.t('labs.estimatedTime')}</div>
                    <div className="font-semibold">{selectedLab.estimated_time} {i18n.t('labs.minutes')}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-light-surface dark:bg-dark-surface rounded-lg shadow p-6">
                <p className="text-light-muted dark:text-dark-muted">{i18n.t('labs.selectLab')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
