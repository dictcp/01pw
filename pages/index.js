import React from 'react'
import Head from 'next/head'
import axios from 'axios';
import dynamic from 'next/dynamic'

export default class extends React.Component {
  static async getInitialProps({req}) {
    // FIXME
    const res = await axios.get('http://127.0.0.1:3000/api/secrets');
    return {data: res.data}
  }
  render () {
    const PasswordBox = dynamic(import('../components/PasswordBox'), {ssr: true})
    return (
      <div>
        <Head>
            <title>01pw</title>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            <link rel="stylesheet" href="https://unpkg.com/purecss@0.6.1/build/pure-min.css" />
            <link rel="stylesheet" href="https://unpkg.com/font-awesome@4.7.0/css/font-awesome.min.css" />
        </Head>
        
        <div className="pure-g">
            <div className="pure-u-1-8"></div>
            <div className="pure-u-3-4">
              <h1>01pw</h1>
              <h3>You are logged in as a@b.com</h3>
              <table className="pure-table" style={{width: '100%'}}>
                <thead>
                  <tr>
                    <th>Key</th>
                    <th>Description</th>
                    <th>Password</th>
                  </tr>
                </thead>
                <tbody>
                {Object.entries(this.props.data).map(([name, vault]) => {
                  return Object.entries(vault.secret).map(([itemkey, item]) => {
                  return (
                      <tr>
                        <td>{itemkey}</td>
                        <td>{item.description_unencrypted}</td>
                        <td><PasswordBox vault={name} itemkey={itemkey} /></td>
                      </tr>
                    );
                  })
                })}
                </tbody>
              </table>
            </div>
            <div className="pure-u-1-8"></div>
        </div>
      </div>
    );
  }
}
