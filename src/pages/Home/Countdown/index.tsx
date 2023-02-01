import { useContext, useEffect } from 'react'
import { differenceInSeconds } from 'date-fns'
import { CycleContext } from '..'
import { CountdownContainer, Separator } from './styles'

export function Countdown() {
  const {
    activeCycle,
    activeCycleId,
    amountSecondsPassed,
    markCurrentCycleAsFinished,
    setSecondsPassed,
  } = useContext(CycleContext)

  // Resgatando total de segundos do ciclo ativo
  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0
  // Tempo atual
  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0
  // Calculando minutos e segundos
  const minutesAmount = Math.floor(currentSeconds / 60)
  const secondsAmount = currentSeconds % 60
  // Formatando minutos e segundos para mostrar em tela
  const minutes = String(minutesAmount).padStart(2, '0') // Retorna a string com duas casas, se não tiver completa com 0 no final
  const seconds = String(secondsAmount).padStart(2, '0')
  console.log(minutes)
  console.log(seconds)

  // Iniciando Contador
  useEffect(() => {
    let interval: number
    if (activeCycle) {
      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(
          new Date(),
          activeCycle.startDate,
        )
        if (secondsDifference >= totalSeconds) {
          markCurrentCycleAsFinished()
          setSecondsPassed(secondsDifference)
          clearInterval(interval)
        } else {
          setSecondsPassed(secondsDifference)
        }
      }, 1000)
    }

    // Limpa a useEffect anterior
    return () => {
      clearInterval(interval)
    }
  }, [activeCycle, totalSeconds, activeCycleId, markCurrentCycleAsFinished])

  // Atualizando Título
  useEffect(() => {
    if (activeCycle) {
      document.title = `${minutes}:${seconds} - ${activeCycle.task}`
    }
  }, [minutes, seconds, activeCycle])
  return (
    <CountdownContainer>
      <span>{minutes[0]}</span>
      <span>{minutes[1]}</span>
      <Separator>:</Separator>
      <span>{seconds[0]}</span>
      <span>{seconds[1]}</span>
    </CountdownContainer>
  )
}
