// 이미지의 경로를 만들어주는 함수
export function makeImagePath(id: string, format?: string) {
  return `https://image.tmdb.org/t/p/${format ? format : "original"}/${id}`;
}
// format이지정되어서 오면 그걸 쓰고 아니면 default로 original 씀
