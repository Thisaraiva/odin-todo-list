import './styles/main.css';
import './styles/modal.css';
import { Storage } from './modules/storage';
import { DomController } from './modules/domController';

const storage = Storage();
const projectManager = storage.loadProjects();
const domController = DomController(projectManager, storage);
domController.init();
