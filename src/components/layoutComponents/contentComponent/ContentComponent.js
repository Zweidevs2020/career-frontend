import React from 'react'
import { Layout } from 'antd'

const {Content} = Layout

const ContentComponent = ({children}) => {
  return (
    <Content style={{background: '#FAF8FD'}}>{children}</Content>
  )
}

export default ContentComponent
