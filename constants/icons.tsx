import { Image, type ImageStyle } from 'react-native';

export const getFitnessIcon = (label: string, style?: ImageStyle) => {
  switch (label) {
    case 'Steps today':
      return <Image source={require('../assets/images/icon-run.png')} style={style} />;
    case 'Calories burned':
      return <Image source={require('../assets/images/icon-calories.png')} style={style} />;
    case 'Distance traveled':
      return <Image source={require('../assets/images/icon-run.png')} style={style} />;
    case 'Resting Heart Rate':
      return <Image source={require('../assets/images/icon-like.png')} style={style} />;
    default:
      return null;
  }
};
