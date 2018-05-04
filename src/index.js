import './main.scss';
import './style.css';
import Icon from './images/icon.png';
import Home from './images/home.svg';

function component() {
    var element = document.createElement('div');

    element.innerHTML = ['Hello', 'Webpack!'].join(' ');
    element.classList.add('hello');

    var myIcon = new Image();
    myIcon.src = Icon;
    element.appendChild(myIcon);

    var myHome = new Image();
    myHome.src = Home;
    element.appendChild(myHome);

    return element;
}

document.body.appendChild(component());

console.log(process.env.NODE_ENV);
