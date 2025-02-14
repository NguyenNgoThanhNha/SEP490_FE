const generateImage = (name: string) => {
  return `https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true&name=${encodeURIComponent(name)}`
}
export default generateImage
