import { atom, selector } from 'recoil'

// toDo배열 설명
export interface IToDo {
  text: string
  id: number
  category: string
}

// 사용자가 선택한 카테고리값
export const selecCateState = atom({
  key: "selectedCate",
  default: "TO_DO"
})

// category 배열
export const categoryState = atom({
  key: 'catagory',
  default: ['TO_DO', 'DOING', 'DONE', "DELETE"],
})

// ToDo 배열
export const toDoState = atom<IToDo[]>({
  key: 'toDos',
  default: JSON.parse(localStorage.getItem("todo") || "[]"),
})

// selector
export const toDoSelector = selector({
  key: 'toDoSelector',
  get: ({ get }) => {
    const toDos = get(toDoState)
    const category = get(selecCateState)
    // 사용자가 선택한 카테고리에 따라 하나의 배열만 filter
    return toDos.filter((toDo) => toDo.category === category)
  },
})
