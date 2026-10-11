package com.example.data.local.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import com.example.data.local.entities.BookingEntity
import com.example.data.local.entities.SavedRestaurantEntity
import com.example.data.local.entities.TasteFeedbackEntity
import com.example.data.local.entities.UserPreferencesEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface BookingDao {
  @Query("SELECT * FROM bookings ORDER BY createdAt DESC")
  fun getAllBookings(): Flow<List<BookingEntity>>

  @Insert(onConflict = OnConflictStrategy.REPLACE)
  suspend fun insertBooking(booking: BookingEntity)

  @Query("UPDATE bookings SET status = :status WHERE id = :id")
  suspend fun updateStatus(id: String, status: String)

  @Query("DELETE FROM bookings WHERE id = :id")
  suspend fun deleteBooking(id: String)
}

@Dao
interface SavedRestaurantDao {
  @Query("SELECT restaurantId FROM saved_restaurants ORDER BY savedAt DESC")
  fun getSavedRestaurantIds(): Flow<List<String>>

  @Insert(onConflict = OnConflictStrategy.REPLACE)
  suspend fun saveRestaurant(item: SavedRestaurantEntity)

  @Query("DELETE FROM saved_restaurants WHERE restaurantId = :restaurantId")
  suspend fun unsaveRestaurant(restaurantId: String)

  @Query("SELECT EXISTS(SELECT 1 FROM saved_restaurants WHERE restaurantId = :restaurantId)")
  fun isSaved(restaurantId: String): Flow<Boolean>
}

@Dao
interface TasteFeedbackDao {
  @Query("SELECT * FROM taste_feedback ORDER BY timestamp DESC")
  fun getAllFeedback(): Flow<List<TasteFeedbackEntity>>

  @Insert(onConflict = OnConflictStrategy.REPLACE)
  suspend fun insertFeedback(feedback: TasteFeedbackEntity)
}

@Dao
interface UserPreferencesDao {
  @Query("SELECT * FROM user_preferences WHERE id = 1")
  fun getUserPreferences(): Flow<UserPreferencesEntity?>

  @Insert(onConflict = OnConflictStrategy.REPLACE)
  suspend fun saveUserPreferences(prefs: UserPreferencesEntity)
}
