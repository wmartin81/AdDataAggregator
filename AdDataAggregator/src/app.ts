import { AppHeader } from './app-header';
import { AppContent } from './app-content'; 

const main = () => {
   
    const appBanner = new AppHeader();
    const appContent = new AppContent();

    $('#jquery-app').append(appBanner.element)
        .append(appContent.element);
}

$(main);
