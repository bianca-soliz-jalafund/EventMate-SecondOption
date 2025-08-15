import Menu from "../components/Menu";
import ProtectedRoutesWrapper from "@/components/auth/ProtectedRoutesWrapper";
const MainLayout = () => {
  return (
    <ProtectedRoutesWrapper>
      <div className="">
        <Menu />
      </div>
    </ProtectedRoutesWrapper>
  );
};

export default MainLayout;
