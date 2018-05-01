require('./main.scss');
import Icon from './images/icon.png';

function component() {
    var element = document.createElement('div');

    element.innerHTML = ['Hello', 'Webpack!'].join(' ');
    element.classList.add('hello');

    var myIcon = new Image();
    myIcon.src = Icon;
    element.appendChild(myIcon);

    return element;
}

document.body.appendChild(component());
