import { Link } from 'react-router-dom';
import useDocumentTitle from '../components/Title';

const NotFoundPage = () => {
    useDocumentTitle('404 Not Found');
    return (
        <div>
            404 not found
            <Link to='/'>Home from link</Link>
            <a href="/">Home from a</a>
        </div>
    )
}

export default NotFoundPage;