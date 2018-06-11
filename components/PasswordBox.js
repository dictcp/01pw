import React from 'react'
import axios from 'axios'

export default class extends React.Component {

    constructor(props) {
        super(props);
        this.getSecret = this.getSecret.bind(this)
        this.clearSecret = this.clearSecret.bind(this)
        this.copySecret = this.copySecret.bind(this)
        // this.onButtonClick = this.onButtonClick.bind(this)

        this.secretBox = React.createRef();
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

    copySecret = () => {
        // element ref https://reactjs.org/docs/refs-and-the-dom.html
        // copy https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript  
        // copy lib (not used) clipboardjs.com
        this.secretBox.current.focus()
        this.secretBox.current.select()
        document.execCommand('copy')
    }

    /*
    onButtonClick = () => {
        this.state.loaded?this.copySecret:(this.state.loading?true:this.getSecret)
    }
    */

    render() {
        return (
            <div>
                <form className="pure-form">
                    <input type="text" ref={this.secretBox} style={ this.state.loaded?{backgroundColor: 'white'}:{} } 
                        value={ this.state.loaded ? this.state.value : (this.state.loading ? "loading..." : "") } readOnly />
                    <button type="button" className="pure-button" 
                        onClick={this.state.loaded?this.copySecret:(this.state.loading?()=>{}:this.getSecret)}>
                        <i className={this.state.loaded?"fa fa-clipboard":"fa fa-cloud-download"}></i>
                    </button>
                </form>
            </div>
        )
    }
}