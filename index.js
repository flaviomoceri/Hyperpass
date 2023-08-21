import 'protomux';
import 'hyperswarm';
import 'random-access-memory';
import 'hyperbee';
import 'react-native-fs';
import 'hypercore';
import '@hyperswarm/dht-relay';
import '@hyperswarm/dht-relay/ws';
import "fast-text-encoding";
import 'compact-encoding'
import "./shim";
import "react-native-get-random-values";
import { registerRootComponent } from "expo";

import App from "./app/App";

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);