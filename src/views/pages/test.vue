<script setup lang="ts">
// 收集未缓存的用户ID
function collectUncachedUserIds(messages) {
  const uncachedUserIds = new Set();
  messages.forEach(message => {
    if (!userCache.has(message.userId)) {
      uncachedUserIds.add(message.userId);
    }
  });
  return Array.from(uncachedUserIds);
}

// 批量获取用户信息
function fetchUsersInfo(userIds) {
  return fetch(`/api/users?ids=${userIds.join(',')}`)
    .then(response => response.json())
    .then(usersInfo => {
      usersInfo.forEach(userInfo => {
        userCache.set(userInfo.id, userInfo);
      });
      return usersInfo;
    });
}

// 处理消息
function processMessages(messages) {
  const uncachedUserIds = collectUncachedUserIds(messages);

  if (uncachedUserIds.length > 0) {
    fetchUsersInfo(uncachedUserIds).then(() => {
      messages.forEach(message => {
        const userInfo = userCache.get(message.userId);
        displayMessage(message, userInfo);
      });
    });
  } else {
    messages.forEach(message => {
      const userInfo = userCache.get(message.userId);
      displayMessage(message, userInfo);
    });
  }
}

// 示例消息
const messages = [
  { userId: '1', content: 'Hello!' },
  { userId: '2', content: 'Hi there!' },
  { userId: '1', content: 'How are you?' }
];

// 处理消息
processMessages(messages);

// 收集未缓存的用户ID
function collectUncachedUserIds(messages) {
  const uncachedUserIds = new Set();
  messages.forEach(message => {
    if (!userCache.has(message.userId)) {
      uncachedUserIds.add(message.userId);
    }
  });
  return Array.from(uncachedUserIds);
}

// 批量获取用户信息
function fetchUsersInfo(userIds) {
  return fetch(`/api/users?ids=${userIds.join(',')}`)
    .then(response => response.json())
    .then(usersInfo => {
      usersInfo.forEach(userInfo => {
        userCache.set(userInfo.id, userInfo);
      });
      return usersInfo;
    });
}

// 处理消息
function processMessages(messages) {
  const uncachedUserIds = collectUncachedUserIds(messages);

  if (uncachedUserIds.length > 0) {
    fetchUsersInfo(uncachedUserIds).then(() => {
      messages.forEach(message => {
        const userInfo = userCache.get(message.userId);
        displayMessage(message, userInfo);
      });
    });
  } else {
    messages.forEach(message => {
      const userInfo = userCache.get(message.userId);
      displayMessage(message, userInfo);
    });
  }
}

// 示例消息
const messages = [
  { userId: '1', content: 'Hello!' },
  { userId: '2', content: 'Hi there!' },
  { userId: '1', content: 'How are you?' }
];

// 处理消息
processMessages(messages);
</script>