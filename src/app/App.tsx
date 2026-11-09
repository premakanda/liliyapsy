import { Layout } from "../components/layout/Layout";
import { Page } from "../pages/Pages";
import "../styles/base.css";
export function App({ path }: { path: string }) {
  return (
    <Layout path={path}>
      <Page path={path} />
    </Layout>
  );
}
