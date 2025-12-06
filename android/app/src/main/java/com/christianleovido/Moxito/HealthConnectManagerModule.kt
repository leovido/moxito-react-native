package com.christianleovido.Moxito

import android.content.Context
import android.util.Log
import androidx.health.connect.client.HealthConnectClient
import androidx.health.connect.client.PermissionController
import androidx.health.connect.client.request.AggregateRequest
import androidx.health.connect.client.aggregate.AggregationResult
import androidx.health.connect.client.units.*
import androidx.health.connect.client.permission.HealthPermission
import androidx.health.connect.client.records.*
import androidx.health.connect.client.request.ReadRecordsRequest
import androidx.health.connect.client.time.TimeRangeFilter
import com.facebook.react.bridge.*
import kotlinx.coroutines.*
import java.time.Instant
import java.time.ZoneOffset

class HealthConnectManagerModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  // Module constructor - do absolutely nothing here
  // The module is instantiated when the package is registered at app startup
  // but we don't want to trigger any Health Connect operations until explicitly requested

  // Make client initialization truly lazy - only initialize when actually needed
  private var healthConnectClient: HealthConnectClient? = null
  
  // Only initialize the client when explicitly requested via a method call
  // Don't initialize in constructor or on module creation
  // This prevents any blocking operations or dialogs on app startup
  private fun initializeClientIfNeeded(): HealthConnectClient? {
    if (healthConnectClient == null) {
      // Don't log here to avoid any potential issues
      // Just silently try to initialize, and fail gracefully if it doesn't work
      try {
        healthConnectClient = HealthConnectClient.getOrCreate(reactApplicationContext)
      } catch (e: IllegalStateException) {
        // Health Connect not installed or not available - fail silently
        return null
      } catch (e: Exception) {
        // Any other error - fail silently to avoid blocking
        return null
      }
    }
    return healthConnectClient
  }

  override fun getName(): String = "HealthConnectManager"

  @ReactMethod
  fun isAvailable(promise: Promise) {
    try {
      val client = initializeClientIfNeeded()
      promise.resolve(client != null)
    } catch (e: Exception) {
      Log.e(TAG, "Error checking Health Connect availability", e)
      promise.reject("UNAVAILABLE", "Health Connect is not available", e)
    }
  }

  @ReactMethod
  fun requestAuthorization(promise: Promise) {
    val activity = reactApplicationContext.currentActivity
    if (activity == null || activity !is com.christianleovido.Moxito.MainActivity) {
      promise.reject("NO_ACTIVITY", "No current activity available or wrong activity type")
      return
    }

    val client = initializeClientIfNeeded()
    if (client == null) {
      promise.resolve(false)
      return
    }

    // Use Main thread to ensure we can access Activity
    CoroutineScope(Dispatchers.Main).launch {
      try {
        // Create HealthPermission objects - explicitly cast to help type inference
        val stepPerm = HealthPermission.getReadPermission(StepsRecord::class) as? HealthPermission
        val distancePerm = HealthPermission.getReadPermission(DistanceRecord::class) as? HealthPermission
        val heartRatePerm = HealthPermission.getReadPermission(HeartRateRecord::class) as? HealthPermission
        
        if (stepPerm == null || distancePerm == null || heartRatePerm == null) {
          promise.reject("PERMISSION_ERROR", "Failed to create HealthPermission objects")
          return@launch
        }
        
        val permissions = setOf(stepPerm, distancePerm, heartRatePerm)

        // Check if permissions are already granted
        val grantedPermissionStrings = withContext(Dispatchers.IO) {
          withTimeoutOrNull(5000) {
            client.permissionController.getGrantedPermissions()
          } ?: emptySet<String>()
        }
        
        // Convert HealthPermission to strings for comparison
        val permissionStrings = permissions.map { it.toString() }.toSet()
        val grantedPermissionSet = grantedPermissionStrings.toSet()
        
        // Find permissions that need to be requested - explicitly type as Set<HealthPermission>
        val permissionsToRequest: Set<HealthPermission> = permissions.filter { perm: HealthPermission -> 
          perm.toString() !in grantedPermissionSet 
        }.toSet()

        if (permissionsToRequest.isEmpty()) {
          promise.resolve(true)
          return@launch
        }

        // Request permissions using MainActivity's permission launcher
        try {
          val mainActivity = activity as com.christianleovido.Moxito.MainActivity
          mainActivity.requestHealthConnectPermissions(permissionsToRequest) { grantedPermissionsResult ->
            // This callback is called when user responds to the permission dialog
            CoroutineScope(Dispatchers.Main).launch {
              val grantedPermissionStringsResult = grantedPermissionsResult.map { it.toString() }.toSet()
              val allGranted = permissionsToRequest.all { it.toString() in grantedPermissionStringsResult }
              promise.resolve(allGranted)
            }
          }
        } catch (e: Exception) {
          Log.e(TAG, "Error requesting Health Connect permissions", e)
          promise.resolve(false)
        }
      } catch (e: Exception) {
        Log.e(TAG, "Error in requestAuthorization", e)
        promise.resolve(false)
      }
    }
  }

  @ReactMethod
  fun openHealthConnectSettings(promise: Promise) {
    val activity = reactApplicationContext.currentActivity
    if (activity == null) {
      promise.reject("NO_ACTIVITY", "No current activity available")
      return
    }

    try {
      val intent = android.content.Intent(android.content.Intent.ACTION_VIEW).apply {
        data = android.net.Uri.parse("healthconnect://settings")
        setPackage("com.google.android.apps.healthdata")
      }

      if (intent.resolveActivity(reactApplicationContext.packageManager) != null) {
        activity.startActivity(intent)
        promise.resolve(true)
      } else {
        promise.reject("NOT_AVAILABLE", "Health Connect app is not installed")
      }
    } catch (e: Exception) {
      Log.e(TAG, "Error opening Health Connect", e)
      promise.reject("ERROR", "Failed to open Health Connect", e)
    }
  }

  @ReactMethod
  fun getDailySteps(dateIso: String, promise: Promise) {
    val client = initializeClientIfNeeded()
    if (client == null) {
      promise.reject("UNAVAILABLE", "Health Connect is not available")
      return
    }

    CoroutineScope(Dispatchers.IO).launch {
      try {
        val date = Instant.parse(dateIso)
        val startOfDay = date.atZone(ZoneOffset.UTC).toLocalDate().atStartOfDay(ZoneOffset.UTC).toInstant()
        val endOfDay = startOfDay.plusSeconds(86400 - 1) // End of day

        val request = AggregateRequest(
          metrics = setOf(StepsRecord.COUNT_TOTAL),
          timeRangeFilter = TimeRangeFilter.between(startOfDay, endOfDay)
        )
        
        val response = client.aggregate(request)
        // The result may be null if no data is available in the time range
        val stepCount = (response[StepsRecord.COUNT_TOTAL] as? Long)?.toInt() ?: 0
        promise.resolve(stepCount)
      } catch (e: Exception) {
        Log.e(TAG, "Error reading daily steps", e)
        promise.reject("READ_ERROR", "Failed to read daily steps", e)
      }
    }
  }

  @ReactMethod
  fun getDailyDistanceKilometers(dateIso: String, promise: Promise) {
    val client = initializeClientIfNeeded()
    if (client == null) {
      promise.reject("UNAVAILABLE", "Health Connect is not available")
      return
    }

    CoroutineScope(Dispatchers.IO).launch {
      try {
        val date = Instant.parse(dateIso)
        val startOfDay = date.atZone(ZoneOffset.UTC).toLocalDate().atStartOfDay(ZoneOffset.UTC).toInstant()
        val endOfDay = startOfDay.plusSeconds(86400 - 1)

        val request = AggregateRequest(
          metrics = setOf(DistanceRecord.DISTANCE_TOTAL),
          timeRangeFilter = TimeRangeFilter.between(startOfDay, endOfDay)
        )
        val response = client.aggregate(request)

        // The result may be null if no data is available in the time range
        val distanceTotalInMeters = response[DistanceRecord.DISTANCE_TOTAL]?.inMeters ?: 0L
        val distanceKm = distanceTotalInMeters.toDouble() / 1000.0
        promise.resolve(distanceKm)
      } catch (e: Exception) {
        Log.e(TAG, "Error reading daily distance", e)
        promise.reject("READ_ERROR", "Failed to read daily distance", e)
      }
    }
  }

  @ReactMethod
  fun getDailyDistanceMeters(dateIso: String, promise: Promise) {
    val client = initializeClientIfNeeded()
    if (client == null) {
      promise.reject("UNAVAILABLE", "Health Connect is not available")
      return
    }

    CoroutineScope(Dispatchers.IO).launch {
      try {
        val date = Instant.parse(dateIso)
        val startOfDay = date.atZone(ZoneOffset.UTC).toLocalDate().atStartOfDay(ZoneOffset.UTC).toInstant()
        val endOfDay = startOfDay.plusSeconds(86400 - 1)

        val request = AggregateRequest(
          metrics = setOf(DistanceRecord.DISTANCE_TOTAL),
          timeRangeFilter = TimeRangeFilter.between(startOfDay, endOfDay)
        )
        val response = client.aggregate(request)
        // The result may be null if no data is available in the time range
        val distanceTotalInMeters = response[DistanceRecord.DISTANCE_TOTAL]?.inMeters ?: 0L
        promise.resolve(distanceTotalInMeters.toDouble())
      } catch (e: Exception) {
        Log.e(TAG, "Error reading daily distance", e)
        promise.reject("READ_ERROR", "Failed to read daily distance", e)
      }
    }
  }

  @ReactMethod
  fun getAverageHeartRate(dateIso: String, promise: Promise) {
    val client = initializeClientIfNeeded()
    if (client == null) {
      promise.reject("UNAVAILABLE", "Health Connect is not available")
      return
    }

    CoroutineScope(Dispatchers.IO).launch {
      try {
        val date = Instant.parse(dateIso)
        val startOfDay = date.atZone(ZoneOffset.UTC).toLocalDate().atStartOfDay(ZoneOffset.UTC).toInstant()
        val endOfDay = startOfDay.plusSeconds(86400 - 1)

        val response = client.readRecords(
          ReadRecordsRequest(
            HeartRateRecord::class,
            timeRangeFilter = TimeRangeFilter.between(startOfDay, endOfDay)
          )
        )

        val records = response.records
        if (records.isEmpty()) {
          promise.resolve(0)
          return@launch
        }

        // Calculate average heart rate from all samples across all records
        val allSamples = records.flatMap { it.samples }
        if (allSamples.isEmpty()) {
          promise.resolve(0)
          return@launch
        }

        val totalBpm = allSamples.sumOf { it.beatsPerMinute.toDouble() }
        val averageBpm = (totalBpm / allSamples.size).toInt()
        promise.resolve(averageBpm)
      } catch (e: Exception) {
        Log.e(TAG, "Error reading average heart rate", e)
        promise.reject("READ_ERROR", "Failed to read average heart rate", e)
      }
    }
  }

  companion object {
    private const val TAG = "HealthConnectManager"
  }
}

