import { View, Input, Text } from '@tarojs/components'
import { useState, useCallback } from 'react'
import './index.scss'
import CachedImage from '../CachedImage'
import filterIcon from '../../assets/icons/common/filter.png'
import filterLightIcon from '../../assets/icons/common/filter_light.png'

interface SearchBarProps {
  value: string
  placeholder?: string
  onSearch: (value: string) => void
  onFilterClick?: () => void
  filterActive?: boolean
}

export default function SearchBar({ value, placeholder = '搜索精灵名称...', onSearch, onFilterClick, filterActive = false }: SearchBarProps) {
  const [inputValue, setInputValue] = useState(value)

  const handleInput = useCallback((e: any) => {
    setInputValue(e.detail.value)
  }, [])

  const handleConfirm = useCallback(() => {
    onSearch(inputValue)
  }, [inputValue, onSearch])

  const handleClear = useCallback(() => {
    setInputValue('')
    onSearch('')
  }, [onSearch])

  const handleSearchClick = useCallback(() => {
    onSearch(inputValue)
  }, [inputValue, onSearch])

  return (
    <View className='search-bar-wrap'>
      <View className='search-bar'>
        <View className='search-bar__icon'>
          <Text className='search-bar__icon-text'>🔍</Text>
        </View>
        <Input
          className='search-bar__input'
          type='text'
          placeholder={placeholder}
          value={inputValue}
          onInput={handleInput}
          onConfirm={handleConfirm}
          confirmType='search'
        />
        {inputValue && (
          <View className='search-bar__clear' onClick={handleClear}>
            <Text className='search-bar__clear-text'>✕</Text>
          </View>
        )}
        <View className='search-bar__search-btn' onClick={handleSearchClick}>
          <Text className='search-bar__search-text'>搜索</Text>
        </View>
      </View>
      {onFilterClick && (
        <View className={`search-bar-wrap__filter ${filterActive ? 'search-bar-wrap__filter--active' : ''}`} onClick={onFilterClick}>
          <CachedImage className='search-bar-wrap__filter-icon' src={filterActive ? filterLightIcon : filterIcon} mode='aspectFit' />
        </View>
      )}
    </View>
  )
}
