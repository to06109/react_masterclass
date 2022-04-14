import React, { useEffect } from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import styled from 'styled-components'
import { categoryState, selecCateState, toDoSelector, toDoState } from '../atoms'
import CreateCategory from './CreateCategory'
import CreateToDo from './CreateToDo'
import ToDo from './ToDo'

const Container = styled.div`
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`

const Title = styled.h1`
  font-size: 40px;
`

function ToDoList() {
  const allToDo = useRecoilValue(toDoState)
  // category배열 접근 및 수정
  const [category] = useRecoilState(categoryState)
  // 선택한 카테고리 접근
  const setSelecCate = useSetRecoilState(selecCateState)
  // selector를 이용해 현재 선택한 카테고리에 해당하는 todo배열을 받음
  const toDos = useRecoilValue(toDoSelector)
  
  // localStorage로 persistance
  useEffect(() => {
    localStorage.setItem("todo", JSON.stringify(allToDo))
  })

  // select 변경 감지
  const onInput = (event: React.FormEvent<HTMLSelectElement>) => {
    setSelecCate(event.currentTarget.value as any)
  }

  return (
    <Container>
      <Title>TODAY'S</Title>
      <hr />
      <select onInput={onInput}>
        {category.map(cate => {
          if(cate !== "DELETE") {
            return <option value={cate}>{cate}</option>
          }
        })}
      </select>
      <CreateCategory />
      <CreateToDo />
      {toDos?.map((toDo) => (
        <ToDo key={toDo.id} {...toDo} />
      ))}
    </Container>
  )
}

export default ToDoList