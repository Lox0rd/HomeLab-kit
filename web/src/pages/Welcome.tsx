import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { i18n } from '../i18n'

export function Welcome() {
  const navigate = useNavigate()
  const [hasVisited, setHasVisited] = useState(false)

  useEffect(() => {
    const visited = localStorage.getItem('welcomeViewed')
    if (visited) {
      navigate('/dashboard')
    } else {
      setHasVisited(true)
    }
  }, [navigate])

  const handleGetStarted = () => {
    localStorage.setItem('welcomeViewed', 'true')
    navigate('/dashboard')
  }

  if (!hasVisited) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-12">
          <div className="text-6xl font-bold text-white mb-4">🏠 HOMELAB</div>
          <p className="text-xl text-blue-100 mb-2">{i18n.t('dashboard.welcome')}</p>
          <p className="text-blue-100">{i18n.t('welcome.subtitle')}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-12 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{i18n.t('welcome.features')}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="flex items-start">
              <div className="text-3xl mr-4">📚</div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">{i18n.t('welcome.feature1Title')}</h3>
                <p className="text-gray-600 text-sm">{i18n.t('welcome.feature1Desc')}</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="text-3xl mr-4">📊</div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">{i18n.t('welcome.feature2Title')}</h3>
                <p className="text-gray-600 text-sm">{i18n.t('welcome.feature2Desc')}</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="text-3xl mr-4">🐳</div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">{i18n.t('welcome.feature3Title')}</h3>
                <p className="text-gray-600 text-sm">{i18n.t('welcome.feature3Desc')}</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="text-3xl mr-4">🔒</div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">{i18n.t('welcome.feature4Title')}</h3>
                <p className="text-gray-600 text-sm">{i18n.t('welcome.feature4Desc')}</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleGetStarted}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105"
          >
            {i18n.t('welcome.getStarted')} →
          </button>
        </div>

        <div className="text-center text-blue-100 text-sm">
          <p>{i18n.t('welcome.footer')}</p>
        </div>
      </div>
    </div>
  )
}
