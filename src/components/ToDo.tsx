import { useRecoilValue, useSetRecoilState } from 'recoil'
import styled from 'styled-components'
import { categoryState, IToDo, toDoState } from '../atoms'

const TodoDiv = styled.div`
  margin-top: 10px;
  display: flex;
`

const Button = styled.button`
border-radius: 10px;
  background-color: aliceblue;
  margin-left: 5px;
`


function ToDo({ text, id, category }: IToDo) {
  const setToDos = useSetRecoilState(toDoState)
  const cate = useRecoilValue(categoryState)
  // toDos의 카테고리를 바꾸는 함수
  // const setToDos = useSetRecoilState(toDoState)
  // newCategory 타입 설명
  const onClick = (newCategory: IToDo['category']) => {
    setToDos((oldToDos) => {
      // toDo의 id가 props에서 온 id와 같은지 비교
      // -> toDos에서 category바꿀 to do 위치 찾기
      const targetIndex = oldToDos.findIndex((toDo) => toDo.id === id)
      // category를 클릭한 버튼으로 바꿔줌
      const newToDo = { text, id, category: newCategory }

      if (newCategory === "delete"){ // 삭제버튼 클릭하면 todo 삭제하기
        return [
          ...oldToDos.slice(0, targetIndex),
          ...oldToDos.slice(targetIndex + 1),
        ] 
      }
      else {
        return [
          ...oldToDos.slice(0, targetIndex),
          newToDo,
          ...oldToDos.slice(targetIndex + 1),
        ]
      }
    })
  }
  return (
    <TodoDiv>
    <li>
      <span>{text}</span>
      {/* 선택된 카테고리 빼고 버튼 보여주기  */}
      {cate.map((cate) => {
        if(cate !== category){
          return <Button onClick={() => onClick(cate)}>{cate}</Button>
        }
      })}
    </li>
    </TodoDiv>
  )
}

export default ToDo
