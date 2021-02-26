import { createContext, useState, useContext, useEffect, ReactNode } from 'react'
import { ChallengesContext } from './ChallengesContext'

interface CountdownContextData {
  minutes: number
  seconds: number
  hasFinished: boolean
  isActive: boolean
  startCountdown: () => void
  resetCountdown: () => void
}

interface CountdownProviderProps {
  children: ReactNode
}

export const CountdownContext = createContext({} as CountdownContextData)

let countdownTimeout: NodeJS.Timeout;

export function CountdownProvider({ children }: CountdownProviderProps) {
  const totalMinutes = (25 * 60) //-- 25 minutos em segundos

  const { startNewChallenge } = useContext(ChallengesContext)
  const [time, setTime] = useState(totalMinutes)
  const [isActive, setIsActive] = useState(false)
  const [hasFinished, setHasFinished] = useState(false)

  const minutes = Math.floor(time / 60)
  const seconds = time % 60

  function startCountdown() {
    setIsActive(true)
    setTime(totalMinutes)
  }

  function resetCountdown() {
    setIsActive(false)
    setHasFinished(false)
    setTime(totalMinutes)

    //-- Interrompe o timeout na hora se já está sendo executado, não permitindo que tenha o delay de 1 segundo após clique
    clearTimeout(countdownTimeout)
  }

  useEffect(() => {
    if (isActive && time > 0) {
      countdownTimeout = setTimeout(() => {
        setTime(time - 1)
      }, 1000)
    } else if (isActive && time == 0) {
      setHasFinished(true)
      setIsActive(false)
      startNewChallenge()
    }
  }, [isActive, time])

  return (
    <CountdownContext.Provider 
      value={{
        minutes,
        seconds,
        hasFinished,
        isActive,
        startCountdown,
        resetCountdown,
      }}
    >
      {children}
    </CountdownContext.Provider>
  )
}