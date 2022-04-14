import { useForm } from 'react-hook-form'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { selecCateState, toDoState } from '../atoms'

// 사용자 입력값 toDo 설명
interface IForm {
  toDo: string
}

function CreateToDo() {
  const setToDos = useSetRecoilState(toDoState)
  // 현재 카테고리 받아옴
  const category = useRecoilValue(selecCateState)
  const { register, handleSubmit, setValue } = useForm<IForm>()
  // form의 데이터가 유효할 때 handleSubmit이 호출할 함수
  const handleValid = ({ toDo }: IForm) => {
    // ...oldToDos: oldToDos배열 안의 요소를 반환
    setToDos((oldToDos) => [
      { text: toDo, id: Date.now(), category },
      ...oldToDos,
    ])
    setValue('toDo', '') // submit 완료하면 input 비우기
  }
  return (
    <form onSubmit={handleSubmit(handleValid)}>
      <input
        {...register('toDo', {
          required: 'Please write a To Do',
        })}
        placeholder="Write a to do"
      />
      <button>Add</button>
    </form>
  )
}

export default CreateToDo
