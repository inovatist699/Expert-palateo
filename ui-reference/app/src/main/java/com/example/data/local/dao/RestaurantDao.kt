package com.example.data.local.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import com.example.data.local.entities.RestaurantEntity
import kotlinx.coroutines.flow.Flow

/**
 * Basic Restaurant DAO to query and store cached restaurant recommendations.
 */
@Dao
interface RestaurantDao {
  @Query("SELECT * FROM cached_restaurants ORDER BY recommendedMatchScore DESC")
  fun getAllCachedRestaurants(): Flow<List<RestaurantEntity>>

  @Query("SELECT * FROM cached_restaurants WHERE city = :city ORDER BY recommendedMatchScore DESC")
  fun getCachedRestaurantsByCity(city: String): Flow<List<RestaurantEntity>>

  @Query("SELECT * FROM cached_restaurants WHERE id = :id LIMIT 1")
  suspend fun getRestaurantById(id: String): RestaurantEntity?

  @Insert(onConflict = OnConflictStrategy.REPLACE)
  suspend fun insertRestaurants(restaurants: List<RestaurantEntity>)

  @Insert(onConflict = OnConflictStrategy.REPLACE)
  suspend fun insertRestaurant(restaurant: RestaurantEntity)

  @Query("DELETE FROM cached_restaurants")
  suspend fun clearAll()
}
