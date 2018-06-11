import React from 'react'
import axios from 'axios'

export default class extends React.Component {

    constructor(props) {
        super(props);
        this.getSecret = this.getSecret.bind(this)
        this.clearSecret = this.clearSecret.bind(this)
        this.state = {loaded: false, loading: false, value: ""}
    }

    getSecret = () => {
        this.setState({loading: true})
        const res = axios.post('/api/secret', {
            vault: this.props.vault,
            key: this.props.itemkey
        }).then((res) => {
            this.setState({loading: false, loaded: true, value: res.data.value})
            // clear secret in 10 sec
            setTimeout(this.clearSecret, 10000)
        })
    }

    clearSecret = () => {
        this.setState({loaded: false, value:""})
    }

    render() {
        return (
            <div 
                style={{width: 40, overflow: 'auto', overflowX: 'hidden', height: 20}}
                onClick={this.getSecret}>
              { this.state.loaded?this.state.value:(this.state.loading?"loading...":"reveal") }
            </div>
        )
    }
    // style={{width: 300, overflow: 'auto', overflowX: 'hidden', height: 100}}  
}