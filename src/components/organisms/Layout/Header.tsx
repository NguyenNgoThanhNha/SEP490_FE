import { useSelector } from "react-redux";
import Navbar from "../Navbar/AdminNavbar"
import { RootState } from "@/store";

const getRoleName = (roleID: number) => {
  switch (roleID) {
    case 1:
      return "Admin";
    case 2:
      return "Manager";
    case 4:
      return "Staff";
    default:
      return "User";
  }
};

const Header = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div>
      <Navbar
        title="Dashboard"
        user={{
          name: user?.userName || "Guest",
          role: getRoleName(user?.roleID as number),
           avatar: user?.avatar  || "https://i.pinimg.com/736x/77/1b/20/771b2040dc38a0ac151c398a22af2d42.jpg"
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