import channelType from '../types/channelType'

const getChannelTypeNumber = (type: channelType) => {
  switch (type) {
    case 'GUILD_TEXT':
    default:
      return 0

    case 'DM':
      return 1

    case 'GUILD_VOICE':
      return 2

    case 'GROUP_DM':
      return 3

    case 'GUILD_CATEGORY':
      return 4

    case 'GUILD_NEWS':
      return 5

    case 'GUILD_STORE':
      return 6

    case 'GUILD_NEWS_THREAD':
      return 10

    case 'GUILD_PUBLIC_THREAD':
      return 11

    case 'GUILD_PRIVATE_THREAD':
      return 12

    case 'GUILD_STAGE_VOICE':
      return 13
  }
}

export default getChannelTypeNumber
