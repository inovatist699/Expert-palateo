package com.example.data.local

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import com.example.data.local.dao.BookingDao
import com.example.data.local.dao.RestaurantDao
import com.example.data.local.dao.SavedRestaurantDao
import com.example.data.local.dao.TasteFeedbackDao
import com.example.data.local.dao.UserPreferencesDao
import com.example.data.local.entities.BookingEntity
import com.example.data.local.entities.RestaurantEntity
import com.example.data.local.entities.SavedRestaurantEntity
import com.example.data.local.entities.TasteFeedbackEntity
import com.example.data.local.entities.UserPreferencesEntity

@Database(
  entities = [
    RestaurantEntity::class,
    BookingEntity::class,
    SavedRestaurantEntity::class,
    TasteFeedbackEntity::class,
    UserPreferencesEntity::class
  ],
  version = 2,
  exportSchema = false
)
abstract class ZestDatabase : RoomDatabase() {
  abstract fun restaurantDao(): RestaurantDao
  abstract fun bookingDao(): BookingDao
  abstract fun savedRestaurantDao(): SavedRestaurantDao
  abstract fun tasteFeedbackDao(): TasteFeedbackDao
  abstract fun userPreferencesDao(): UserPreferencesDao

  companion object {
    @Volatile
    private var INSTANCE: ZestDatabase? = null

    fun getDatabase(context: Context): ZestDatabase {
      return INSTANCE ?: synchronized(this) {
        val instance = Room.databaseBuilder(
          context.applicationContext,
          ZestDatabase::class.java,
          "zest_india_database"
        ).fallbackToDestructiveMigration().build()
        INSTANCE = instance
        instance
      }
    }
  }
}
