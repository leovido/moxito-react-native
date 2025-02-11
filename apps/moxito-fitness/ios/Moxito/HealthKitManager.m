#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(HealthKitManager, NSObject)

RCT_EXTERN_METHOD(requestAuthorization: (RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getStepCount: (NSDate *)startDate
                  endDate:(NSDate *)endDate
                  resolve:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(fetchHealthDataForDateRange:(NSDate *)startDate
                  endDate:(NSDate *)endDate
                  resolve:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(checkNoManualInput:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(fetchCaloriesBurned:(NSDate *)startDate
                  endDate:(NSDate *)endDate
                  resolve:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getRestingHeartRateForMonth:(NSDate *)startDate
                  endDate:(NSDate *)endDate
                  resolve:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getAverageHeartRate:(NSDate *)startDate
                  endDate:(NSDate *)endDate
                  resolve:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(fetchDistance:(NSDate *)startDate
                  endDate:(NSDate *)endDate
                  resolve:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getTodayStepCount:(NSDate *)startDate
                  endDate:(NSDate *)endDate
                  resolve:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(fetchWorkouts:(NSDate *)startDate
                  endDate:(NSDate *)endDate
                  resolve:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(fetchAvgHRWorkouts:(NSDate *)startDate
                  endDate:(NSDate *)endDate
                  resolve:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end