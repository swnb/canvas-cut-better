import * as React from 'react';
import './App.css';
import { CanvasCutComponent } from 'canvas-cut';
import { ErrorBoundary } from 'error-boundary';

class App extends React.Component {
	public render = () => (
		<ErrorBoundary>
			<CanvasCutComponent />;
		</ErrorBoundary>
	);
}

export default App;
