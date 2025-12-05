import { Image, type ImageStyle } from 'react-native';

export const getFitnessIcon = (label: string, style?: ImageStyle) => {
  const normalizedLabel = label.trim().toLowerCase();

  switch (normalizedLabel) {
    case 'steps':
    case 'steps today':
    case 'steps total':
      return <Image source={require('../assets/images/icon-run.png')} style={style} />;
    case 'calories burned':
      return <Image source={require('../assets/images/icon-calories.png')} style={style} />;
    case 'distance':
    case 'distance in km':
    case 'distance traveled':
      return <Image source={require('../assets/images/icon-run.png')} style={style} />;
    case 'heart rate':
    case 'resting heart rate':
      return <Image source={require('../assets/images/icon-like.png')} style={style} />;
    case 'date':
      return <Image source={require('../assets/images/icon-frame.png')} style={style} />;
    default:
      return null;
  }
};
