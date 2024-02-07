interface IProps {
  urls: {
    full: string
    small: string
  }
}

export const selectUnsplashImage = (
  files: IProps[]
): { imgFull: string; imgSmall: string } => {
  const randomFile = Math.floor(Math.random() * files.length)
  const imgFull = files[randomFile].urls.full
  const imgSmall = files[randomFile].urls.small
  return { imgFull, imgSmall }
}
