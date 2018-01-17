import { Menu } from './menu';
import { AdData } from './ad-data';

const main = () => {
    $('#jquery-app')
        .append(Menu())
        .append(AdData());
}

$(main);
