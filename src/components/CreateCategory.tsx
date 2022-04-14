import { useForm } from "react-hook-form";
import { useSetRecoilState } from "recoil";
import { categoryState } from "../atoms";

interface ICategory {
    cate: string,
}

function CreateCategory() {
    const { register, handleSubmit, setValue} = useForm<ICategory>();
    const setCategory = useSetRecoilState(categoryState)
    // 카테고리 추가
    const addCategory = (data: ICategory) => {
        setCategory((oldCate) => [
        data["cate"], ...oldCate,
        ])
        setValue("cate", "")
    } 
    return (
        <form onSubmit={handleSubmit(addCategory)}>
            <input {...register("cate")} placeholder='Add your own category!'/>
            <button>Add</button>
        </form>
    )
}

export default CreateCategory