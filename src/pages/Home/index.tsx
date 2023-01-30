import { Play, HandPalm } from 'phosphor-react'
import {
  CountdownContainer,
  HomeContainer,
  Separator,
  StartCountdownButton,
  StopCountdownButton,
} from './styles'
import { useState, useEffect, createContext } from 'react'
import { differenceInSeconds } from 'date-fns'

interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptedDate?: Date // Opcional
  finishedDate?: Date // Opcional
}

// Criando contexto da aplicação
interface CyclesContextType {
  activeCycle: Cycle | undefined
}

export const CycleContext = createContext({} as CyclesContextType)

// Main da Aplicação

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

  // Função para interromper um ciclo
  function handleInterruptCycle() {
    setCycles((state) =>
      // Atualizando cycle dentro do array
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, interruptedDate: new Date() }
        } else {
          return cycle
        }
      }),
    )
    setActiveCycleId(null)
  }
  // Resgatando o ciclo ativo
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)
  console.log(activeCycle)

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
  const task = watch('task') // Para monitorar o campo task, utilizado para habilitar e dezabilitar o botão começar
  const isSubmitDesable = !task

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
          setCycles((state) =>
            // Atualizando cycle dentro do array
            state.map((cycle) => {
              if (cycle.id === activeCycleId) {
                return { ...cycle, finishedDate: new Date() }
              } else {
                return cycle
              }
            }),
          )
          setAmountSecondsPassed(secondsDifference)
          setActiveCycleId(null)
          clearInterval(interval)
        } else {
          setAmountSecondsPassed(secondsDifference)
        }
      }, 1000)
    }

    // Limpa a useEffect anterior
    return () => {
      clearInterval(interval)
    }
  }, [activeCycle, totalSeconds, activeCycleId])

  // Atualizando Título
  useEffect(() => {
    if (activeCycle) {
      document.title = `${minutes}:${seconds} - ${activeCycle.task}`
    }
  }, [minutes, seconds, activeCycle])

  return (
    <HomeContainer>
      <form action="" onSubmit={handleSubmit(handleCreatenewCycle)}>
        <CountdownContainer>
          <span>{minutes[0]}</span>
          <span>{minutes[1]}</span>
          <Separator>:</Separator>
          <span>{seconds[0]}</span>
          <span>{seconds[1]}</span>
        </CountdownContainer>
        {activeCycle ? (
          <StopCountdownButton type="button" onClick={handleInterruptCycle}>
            <HandPalm size={24} />
            Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton type="submit" disabled={isSubmitDesable}>
            <Play size={24} />
            Começar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  )
}
