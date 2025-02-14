import Navbar from "../Navbar/AdminNavbar"

const Header = () => {
  return (
    <div>
      <Navbar
        title="Dashboard"
        user={{
          name: "John Doe",
          role: "Admin",
          avatar: "https://i.pinimg.com/736x/77/1b/20/771b2040dc38a0ac151c398a22af2d42.jpg"
        }}
        languages={[
          { code: "en", label: "English" },
          { code: "vi", label: "Tiếng Việt" },
        ]}
      />

    </div>
  )
}

export default Header