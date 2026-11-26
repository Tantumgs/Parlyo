import 'package:firebase_core/firebase_core.dart' show FirebaseOptions;
import 'package:flutter/foundation.dart'
    show defaultTargetPlatform, kIsWeb, TargetPlatform;

class DefaultFirebaseOptions {
  static FirebaseOptions get currentPlatform {
    if (kIsWeb) {
      return const FirebaseOptions(
        apiKey: 'AIzaSyB1ZkpkP50lSM5gSsX7Rrse67N8fVkpnwk',
        appId: '1:389318019863:web:f912930b5284849e050552',
        messagingSenderId: '389318019863',
        projectId: 'parlyo',
        authDomain: 'parlyo.firebaseapp.com',
        storageBucket: 'parlyo.firebasestorage.app',
        databaseURL: 'https://parlyo-default-rtdb.firebaseio.com',
        measurementId: 'G-EN1XEJTNF8',
      );
    }
    if (defaultTargetPlatform == TargetPlatform.android) {
      return const FirebaseOptions(
        apiKey: 'AIzaSyDNTNndp1WDQynmPXm7bwjwydjr-a-v_QA',
        appId: '1:389318019863:android:c7081368ffc97700050552',
        messagingSenderId: '389318019863',
        projectId: 'parlyo',
        storageBucket: 'parlyo.firebasestorage.app',
        databaseURL: 'https://parlyo-default-rtdb.firebaseio.com',
      );
    }
    if (defaultTargetPlatform == TargetPlatform.iOS) {
      return const FirebaseOptions(
        apiKey: 'AIzaSyAWgpqdwCk8H9EQMKqpbzMqZ5l6UDJU8Xc',
        appId: '1:389318019863:ios:cf44d957675b0653050552',
        messagingSenderId: '389318019863',
        projectId: 'parlyo',
        storageBucket: 'parlyo.firebasestorage.app',
        databaseURL: 'https://parlyo-default-rtdb.firebaseio.com',
        iosBundleId: 'com.parlyo.app',
      );
    }
    throw UnsupportedError('Firebase is not configured for this platform.');
  }
}
