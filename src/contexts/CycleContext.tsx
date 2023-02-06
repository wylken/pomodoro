import { createContext, ReactNode, useState } from 'react'

// Interface do Ciclo
interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptedDate?: Date // Opcional
  finishedDate?: Date // Opcional
}

// Interface para o Cyclo no Formulário
interface CreateCycleData {
  task: string
  minutesAmount: number
}

// Criando contexto da aplicação
interface CyclesContextType {
  cycles: Cycle[]
  activeCycle: Cycle | undefined
  activeCycleId: string | null
  amountSecondsPassed: number
  markCurrentCycleAsFinished: () => void
  setSecondsPassed: (seconds: number) => void
  createNewCycle: (data: CreateCycleData) => void
  interruptCurrentCycle: () => void
}

export const CycleContext = createContext({} as CyclesContextType)

interface CyclesContextProviterProps {
  children: ReactNode
}

export function CycleContextProvider({ children }: CyclesContextProviterProps) {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

  // Resgatando o ciclo ativo
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  function markCurrentCycleAsFinished() {
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
    setActiveCycleId(null)
  }

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds)
  }

  // Função para começar um novo ciclo
  function createNewCycle(data: CreateCycleData) {
    const newCycle: Cycle = {
      id: String(new Date().getTime()),
      minutesAmount: data.minutesAmount,
      task: data.task,
      startDate: new Date(),
    }
    setCycles((state) => [...state, newCycle])
    setActiveCycleId(newCycle.id)
    // reset()
    setAmountSecondsPassed(0)
  }

  // Função para interromper um ciclo
  function interruptCurrentCycle() {
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

  return (
    <CycleContext.Provider
      value={{
        cycles,
        activeCycle,
        activeCycleId,
        markCurrentCycleAsFinished,
        amountSecondsPassed,
        setSecondsPassed,
        createNewCycle,
        interruptCurrentCycle,
      }}
    >
      {children}
    </CycleContext.Provider>
  )
}
