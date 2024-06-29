import { registerReactControllerComponents } from '@symfony/ux-react';
import './bootstrap.js';
import './navbar.js';
import './styles/home.scss';

registerReactControllerComponents(require.context('./react/controllers', true, /\.(j|t)sx?$/));