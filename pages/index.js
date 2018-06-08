import React from 'react'
import Head from 'next/head'
import axios from 'axios';
import dynamic from 'next/dynamic'

export default class extends React.Component {
  static async getInitialProps () {
    // FIXME
    const res = await axios.get('http://127.0.0.1:3000/api/secrets');
    return {data: res.data}
  }
  render () {
    const PasswordBox = dynamic(import('../components/PasswordBox'), {ssr: true})
    return (
      <div>
        <Head>
            <title>01PW</title>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            <link rel="stylesheet" href="https://unpkg.com/purecss@0.6.1/build/pure-min.css" />
        </Head>
        
        <div className="pure-g">
            <div className="pure-u-1-3"></div>
            <div className="pure-u-1-3">
              <h1>01PW</h1>
              <table className="pure-table">
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
            <div className="pure-u-1-3"></div>
        </div>
      </div>
    );
  }
}
