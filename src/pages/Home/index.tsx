import { Play } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import {
  CountdownContainer,
  FormContainer,
  HomeContainer,
  MinutesAmountInput,
  Separator,
  StartContdownButton,
  TaskInput,
} from './styles'

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod.number().min(5).max(60),
})

export function Home() {
  const { register, handleSubmit, watch, formState } = useForm({
    resolver: zodResolver(newCycleFormValidationSchema),
  })

  console.log(formState)

  function handleCreatenewCycle(data: any) {}
  const task = watch('task') // Para monitorar o campo task, utilizado para habilitar e dezabilitar o botão começar
  const isSubmitDesable = !task
  return (
    <HomeContainer>
      <form action="" onSubmit={handleSubmit(handleCreatenewCycle)}>
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em</label>
          <TaskInput
            type="text"
            id="task"
            placeholder="Dê um nome para o seu projeto"
            list="task-suggestions"
            {...register('task')}
          />
          <datalist id="task-suggestions">
            <option>Projeto 01</option>
            <option>Projeto 02</option>
          </datalist>

          <label htmlFor="minutesAmount">durante</label>
          <MinutesAmountInput
            type="number"
            id="minutesAmount"
            placeholder="00"
            step={5}
            min={5}
            max={60}
            {...register('minutesAmount', { valueAsNumber: true })}
          />

          <span>minutos</span>
        </FormContainer>
        <CountdownContainer>
          <span>0</span>
          <span>0</span>
          <Separator>:</Separator>
          <span>0</span>
          <span>0</span>
        </CountdownContainer>
        <StartContdownButton type="submit" disabled={isSubmitDesable}>
          <Play size={24} />
          Começar
        </StartContdownButton>
      </form>
    </HomeContainer>
  )
}
