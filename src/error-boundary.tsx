import * as React from 'react';

export class ErrorBoundary extends React.Component {
	public static getDerivedStateFromError(error: Error) {
		// Update state so the next render will show the fallback UI.
		return { hasError: true };
	}

	public state = { hasError: false };

	constructor(props: any) {
		super(props);
	}

	public componentDidCatch(error: Error, info: React.ErrorInfo) {
		// You can also log the error to an error reporting service
		window.console.log(error, info);
	}

	public render() {
		if (this.state.hasError) {
			// You can render any custom fallback UI
			return <h1>some thing error happend</h1>;
		}

		return this.props.children;
	}
}
