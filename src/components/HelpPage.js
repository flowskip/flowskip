import React from 'react';
import "./styles/HelpPage.css";

class HelpPage extends React.Component{

    render() {
        return (
            <React.Fragment>
                <div class="header__info">
                    <div class="header__info-title">
                        <h2>How To Use</h2>
                        <p>Learn how to use our app and enjoy it to the fullest</p>
                    </div>
                    <div class="header_info--img">
                        <img src="https://cdn.icon-icons.com/icons2/1451/PNG/128/musicfolder_99333.png" alt="" />
                    </div>
                </div>
                <hr className="header-divider"/>
                <div class="main-containter">
                    <div className="side-bar">
                        <div className="searcher">
                            <input type="search" placeholder="Search" />
                            <img src="https://cdn.icon-icons.com/icons2/1489/PNG/128/magnifyingglass_102622.png" alt="" />
                        </div>
                        <div className="divider-elementor">
                            <div className="side-bar-links">
                                <h3>BROWSE BY</h3>
                                <a href="#get-firend">Get some friends</a>
                                <a href="#set-things">Set things louder</a>
                                <a href="#virtual-room">Create a virtual room</a>
                                <a href="#share-code">Share your code</a>
                                <a href="#keep-flow">Keep the flow</a>
                            </div>
                        </div>
                    </div>
                    <main>
                        <div className="cart-containter">
                            <div className="card">
                                <a href=""><img src="https://th.bing.com/th/id/OIP.qQFRcxetSCY-cXDLYq7X9gHaFG?pid=ImgDet&rs=1" alt="" className="giphy-embed" /></a>
                                <h2>Get some friends</h2>
                                <p>Invite your friends or family to get some fun, Lorem ipsum dolor sit amet consectetur adipisicing elit. Id repellat dolor sit amet consectetur adipisicing elit. Id repellat </p>
                            </div>
                        </div>
                        <div className="cart-containter">
                            <div className="card">
                                <a href=""><img src="https://th.bing.com/th/id/OIP.qQFRcxetSCY-cXDLYq7X9gHaFG?pid=ImgDet&rs=1" alt="" className="giphy-embed" /></a>
                                <h2 id="set-things">Set things louder</h2>
                                <p>Invite your friends or family to get some fun , Lorem ipsum dolor sit amet consectetur adipisicing elit. Id repellat dolor sit amet consectetur adipisicing elit. Id repellat</p>
                            </div>
                        </div>
                        <div className="cart-containter">
                            <div className="card">
                                <a href=""><img src="https://th.bing.com/th/id/OIP.qQFRcxetSCY-cXDLYq7X9gHaFG?pid=ImgDet&rs=1" alt="" className="giphy-embed" /></a>
                                <h2 id="virtual-room">Create a virtual room</h2>
                                <p>Invite your friends or family to get some fun , Lorem ipsum dolor sit amet consectetur adipisicing elit. Id repellat dolor sit amet consectetur adipisicing elit. Id repellat</p>
                            </div>
                        </div>
                        <div className="cart-containter">
                            <div className="card">
                                <a href=""><img src="https://th.bing.com/th/id/OIP.qQFRcxetSCY-cXDLYq7X9gHaFG?pid=ImgDet&rs=1" alt="" className="giphy-embed" /></a>
                                <h2 id="share-code">Share your code</h2>
                                <p>Invite your friends or family to get some fun , Lorem ipsum dolor sit amet consectetur adipisicing elit. Id repellat dolor sit amet consectetur adipisicing elit. Id repellat</p>
                            </div>
                        </div>
                        <div className="cart-containter">
                            <div className="card">
                                <a href=""><img src="https://th.bing.com/th/id/OIP.qQFRcxetSCY-cXDLYq7X9gHaFG?pid=ImgDet&rs=1" alt="" className="giphy-embed" /></a>
                                <h2 id="keep-flow">Keep the flow</h2>
                                <p>Invite your friends or family to get some fun , Lorem ipsum dolor sit amet consectetur adipisicing elit. Id repellat dolor sit amet consectetur adipisicing elit. Id repellat</p>
                            </div>
                        </div>
                    </main>
                </div>
        </React.Fragment>
        )
    }
}

export default HelpPage