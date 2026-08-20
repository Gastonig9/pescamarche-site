import { Outlet } from "react-router-dom";
import styled from "styled-components";
import { Header } from "./Header";
import { Footer } from "./Footer";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
`;

const Main = styled.main`
  flex: 1;
  min-height: auto;
  width: 100%;
  padding: 0;
  
  /* Mobile */
  @media (max-width: 639px) {
    padding: 12px;
  }
  
  /* Tablet y superior */
  @media (min-width: 640px) {
    padding: 20px;
  }
  
  @media (min-width: 1024px) {
    padding: 24px;
  }
`;

export function Layout() {
  return (
    <Container>
      <Header />
      <Main>
        <Outlet />
      </Main>
      <Footer />
    </Container>
  );
}
