package com.christianleovido.Moxito
import expo.modules.splashscreen.SplashScreenManager

import android.os.Build
import android.os.Bundle
import androidx.activity.result.ActivityResultLauncher
import androidx.activity.result.contract.ActivityResultContracts
import androidx.health.connect.client.HealthConnectClient
import androidx.health.connect.client.PermissionController
import androidx.health.connect.client.permission.HealthPermission
import androidx.health.connect.client.records.*
import android.util.Log

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

import expo.modules.ReactActivityDelegateWrapper

class MainActivity : ReactActivity() {
  private var healthConnectPermissionLauncher: ActivityResultLauncher<Set<String>>? = null
  private var permissionCallback: ((Set<HealthPermission>) -> Unit)? = null
  private var requestedPermissions: Set<HealthPermission>? = null
  
  override fun onCreate(savedInstanceState: Bundle?) {
    // Set the theme to AppTheme BEFORE onCreate to support
    // coloring the background, status bar, and navigation bar.
    // This is required for expo-splash-screen.
    // setTheme(R.style.AppTheme);
    // @generated begin expo-splashscreen - expo prebuild (DO NOT MODIFY) sync-f3ff59a738c56c9a6119210cb55f0b613eb8b6af
    SplashScreenManager.registerOnActivity(this)
    // @generated end expo-splashscreen
    super.onCreate(null)
    
    // Initialize Health Connect permission launcher lazily when needed
    // This avoids issues if Health Connect is not available at startup
    healthConnectPermissionLauncher = null
  }
  
  fun requestHealthConnectPermissions(permissions: Set<HealthPermission>, callback: (Set<HealthPermission>) -> Unit) {
    permissionCallback = callback
    requestedPermissions = permissions
    
    // Initialize launcher if not already initialized
    if (healthConnectPermissionLauncher == null) {
      try {
        // Use static method from PermissionController to create the contract
        // The contract works with Set<String> (permission strings)
        val contract = PermissionController.createRequestPermissionResultContract()
        healthConnectPermissionLauncher = registerForActivityResult(contract) { grantedPermissionStrings: Set<String> ->
          // Convert the granted permission strings back to HealthPermission objects
          // by matching them with the originally requested permissions
          val requested = requestedPermissions ?: emptySet()
          val grantedPermissions = requested.filter { it.toString() in grantedPermissionStrings }.toSet()
          permissionCallback?.invoke(grantedPermissions)
          permissionCallback = null
          requestedPermissions = null
          Log.d("MainActivity", "Health Connect permissions granted: ${grantedPermissions.size}")
        }
      } catch (e: Exception) {
        Log.e("MainActivity", "Failed to create Health Connect permission launcher", e)
        callback(emptySet())
        return
      }
    }
    
    // Convert HealthPermission objects to strings for the launcher
    val permissionStrings = permissions.map { it.toString() }.toSet()
    healthConnectPermissionLauncher?.launch(permissionStrings) ?: run {
      Log.e("MainActivity", "Health Connect permission launcher is null")
      callback(emptySet())
    }
  }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "main"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate {
    return ReactActivityDelegateWrapper(
          this,
          BuildConfig.IS_NEW_ARCHITECTURE_ENABLED,
          object : DefaultReactActivityDelegate(
              this,
              mainComponentName,
              fabricEnabled
          ){})
  }

  /**
    * Align the back button behavior with Android S
    * where moving root activities to background instead of finishing activities.
    * @see <a href="https://developer.android.com/reference/android/app/Activity#onBackPressed()">onBackPressed</a>
    */
  override fun invokeDefaultOnBackPressed() {
      if (Build.VERSION.SDK_INT <= Build.VERSION_CODES.R) {
          if (!moveTaskToBack(false)) {
              // For non-root activities, use the default implementation to finish them.
              super.invokeDefaultOnBackPressed()
          }
          return
      }

      // Use the default back button implementation on Android S
      // because it's doing more than [Activity.moveTaskToBack] in fact.
      super.invokeDefaultOnBackPressed()
  }
}
