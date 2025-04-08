/**
 * Вспомогательные функции для проекта
 */

/**
 * Функция-напоминание о необходимости обращаться к заметкам и файлам с важной информацией
 * @param {string} actionType - тип выполняемого действия
 */
function remindToCheckNotes(actionType = '') {
    // Список файлов с важной информацией
    const importantFiles = [
        'development_plan.md',
        'src/README.md',
        'src/notes.md'
    ];
    
    // Вывод напоминания в консоль
    console.log('=== НАПОМИНАНИЕ ===');
    console.log(`Перед выполнением действия "${actionType || 'текущего'}" не забудь проверить записи в файлах:`);
    importantFiles.forEach(file => console.log(`- ${file}`));
    console.log('==================');
    
    return true; // Для возможности использования в цепочке вызовов
}

/**
 * Добавить заметку в файл заметок
 * @param {string} note - текст заметки
 * @param {string} category - категория заметки
 */
function addNote(note, category = 'общее') {
    // В реальном проекте здесь будет код для добавления заметки в файл
    console.log(`Добавлена заметка в категории "${category}": ${note}`);
}

// Экспорт функций
module.exports = {
    remindToCheckNotes,
    addNote
}; 