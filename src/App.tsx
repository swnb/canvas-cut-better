import * as React from 'react';
import './App.css';
import { CanvasCutComponent } from 'canvas-cut';
import { Menu } from './menu';
import { ErrorBoundary } from 'error-boundary';

class App extends React.Component {
	public render = () => (
		<ErrorBoundary>
			<CanvasCutComponent />
			<Menu />
		</ErrorBoundary>
	);
}

export default App;
