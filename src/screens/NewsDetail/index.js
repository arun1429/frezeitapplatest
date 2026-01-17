import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  Text,
  Image,
  View,
  useWindowDimensions,
} from 'react-native';
import RenderHTML from 'react-native-render-html';
import { SafeAreaView } from 'react-native-safe-area-context';
import Banner from '../../components/AdMob/Banner';
import HeaderWithTittle from '../../components/Header/HeaderWithText';
import withSequentialRendering from '../../components/withSequentialRendering';
import colors from '../../constants/colors';
import styles from './styles';

const SequentialBanner = withSequentialRendering(Banner);

// ✅ STATIC (no rerenders)
const HTML_BASE_STYLE = {
  color: colors.white,
};

export default function NewsDetail(props) {
  const { width: contentWidth } = useWindowDimensions();
  const { item: newsDetail } = props.route.params;

  const {
    image,
    title,
    'dc:creator': creator,
    pubDate,
    'content:encoded': content,
  } = newsDetail;

  const [imageSize, setImageSize] = useState({ width: contentWidth, height: 200 });

  // ✅ runs ONLY when image or width changes
  useEffect(() => {
    if (!image) return;

    Image.getSize(image, (width, height) => {
      const scaleFactor = width / contentWidth;
      const imageHeight = height / scaleFactor;
      setImageSize({ width: contentWidth, height: imageHeight });
    });
  }, [image, contentWidth]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.backgroudColor }}>
      <HeaderWithTittle name="News" navigation={props.navigation} />

      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <Image
          style={{ width: imageSize.width, height: imageSize.height }}
          source={{ uri: image }}
        />

        <View style={styles.newsText}>
          <Text style={styles.newsTitle}>{title}</Text>
          <Text style={styles.newsMeta}>
            {creator ?? ''} ·{' '}
            {pubDate
              ? moment(pubDate, 'ddd, D MMM YYYY HH:mm:ss').fromNow()
              : null}
          </Text>

          <SequentialBanner />

          <View style={{ marginTop: 10 }}>
            <RenderHTML
              contentWidth={contentWidth}
              source={{ html: content }}
              baseStyle={HTML_BASE_STYLE}
              enableCSSInlineProcessing={false}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
