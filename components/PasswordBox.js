import React from 'react'
import axios from 'axios'

export default class extends React.Component {

    constructor(props) {
        super(props);
        this.loadpasswd = this.loadpasswd.bind(this)
        this.state = {value: "load"}
    }

    loadpasswd = () => {
        this.setState({value: "loading..."})
        const res = axios.get('/api/secret', {
            params: {
                vault: this.props.vault,
                key: this.props.itemkey
            }
        }).then((res) => {
            this.setState({value: res.data.value})
        })
    }

    render() {
        return (
            <div onClick={this.loadpasswd}>{this.state.value}</div>
        )
    }
}