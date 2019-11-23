/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

function Main() {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
}
AppRegistry.registerComponent(appName, () => Main);
