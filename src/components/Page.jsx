import { PageHeader } from "./PageHeader";

export function Page({children}) {
  return (
    <div style={{maxWidth: '1180px', margin: '0 auto', padding: '0 54px 70px' }}>
      <PageHeader> {children} </PageHeader>
    </div>
  )
}